// src/screens/BountyFeed.jsx
import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import FilterBar from '../components/FilterBar'
import PostCard from '../components/PostCard'
import { usePostsStore } from '../store'
import { Row, Col, Alert } from 'react-bootstrap'

export default function BountyFeed() {
  const { posts } = usePostsStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const tagFromUrl = searchParams.get('tag')

  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState('all')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [tags, setTags] = useState(tagFromUrl || '')
  const [searchQuery, setSearchQuery] = useState('')

  // Update tags when URL parameter changes
  useEffect(() => {
    if (tagFromUrl) {
      setTags(tagFromUrl)
      // Clear the URL parameter after reading it
      setSearchParams({}, { replace: true })
    }
  }, [tagFromUrl, setSearchParams])

  const crumbs = [
    {
      label: 'Home',
      onClick: () => setFilter('all'),
      active: filter === 'all',
    },
    {
      label: 'Bounties',
      onClick: () => setFilter('bounty'),
      active: filter === 'bounty',
    },
    {
      label: 'Pre-owned',
      onClick: () => setFilter('resale'),
      active: filter === 'resale',
    },
    {
      label: 'Activity (Looking for partners)',
      onClick: () => setFilter('activity'),
      active: filter === 'activity',
    },
  ]

  const filteredPosts = useMemo(() => {
    const wantedTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    return posts
      .filter((p) => !p.deleted)
      .filter((post) => {
        let matchesChannel = true
        if (filter === 'bounty') {
          matchesChannel = post.type === 'bounty'
        } else if (filter === 'resale') {
          matchesChannel = post.type === 'sale' || post.type === 'free'
        } else if (filter === 'activity') {
          matchesChannel = post.type === 'activity'
        }

        const matchesStatus = status === 'all' || post.status === status

        const price = post.price ?? 0
        const matchesMin = min === '' || price >= Number(min)
        const matchesMax = max === '' || price <= Number(max)

        const matchesTags =
          wantedTags.length === 0 ||
          wantedTags.every((t) =>
            (post.tags || []).map((x) => x.toLowerCase()).includes(t)
          )

        const q = searchQuery.toLowerCase()
        const matchesSearch =
          q === '' ||
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          (post.location || '').toLowerCase().includes(q)

        return (
          matchesChannel &&
          matchesStatus &&
          matchesMin &&
          matchesMax &&
          matchesTags &&
          matchesSearch
        )
      })
  }, [posts, filter, status, min, max, tags, searchQuery])

  return (
    <Layout crumbs={crumbs}>
      <h1 className="visually-hidden">Bounty Feed</h1>
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        status={status}
        setStatus={setStatus}
        min={min}
        setMin={setMin}
        max={max}
        setMax={setMax}
        tags={tags}
        setTags={setTags}
      />

      {filteredPosts.length === 0 ? (
        <Alert variant="info" className="text-center">
          No posts found. Try adjusting your filters.
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredPosts.map((post) => (
            <Col key={post.id} xs={12} md={6} lg={4}>
              <PostCard
                post={post}
                onTagClick={(tag) => {
                  // Add tag to filter if not already present
                  const currentTags = tags
                    .split(',')
                    .map((t) => t.trim().toLowerCase())
                    .filter(Boolean)
                  if (!currentTags.includes(tag.toLowerCase())) {
                    const newTags = tags.trim()
                      ? `${tags}, ${tag}`
                      : tag
                    setTags(newTags)
                  }
                }}
              />
            </Col>
          ))}
        </Row>
      )}
    </Layout>
  )
}
