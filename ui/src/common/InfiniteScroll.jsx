import { useEffect, useRef } from 'react'
import { useListContext } from 'react-admin'
import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

// CUSTOM (not part of official Navidrome)
// Replaces the page buttons with "endless scroll".
// How it works: an invisible marker sits under the list. When you scroll near it,
// we ask the server for MORE items (we grow "perPage"), so the list just keeps going.

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 0',
    minHeight: '1px',
  },
})

export const InfiniteScroll = ({ step }) => {
  const classes = useStyles()
  const { ids, total, perPage, page, setPage, setPerPage, loading } =
    useListContext()
  const marker = useRef(null)

  const shown = ids ? ids.length : 0
  const hasMore = total != null && shown < total

  // Always stay on page 1 so new items are added below the old ones.
  useEffect(() => {
    if (page && page !== 1) setPage(1)
  }, [page, setPage])

  useEffect(() => {
    const el = marker.current
    if (!el || !hasMore || loading) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPerPage(perPage + (step || Math.max(perPage, 50)))
        }
      },
      // Start loading a bit BEFORE you hit the bottom, so it feels seamless.
      { rootMargin: '800px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, perPage, step, setPerPage])

  return (
    <div ref={marker} className={classes.root}>
      {hasMore && <CircularProgress size={28} />}
    </div>
  )
}

export default InfiniteScroll
