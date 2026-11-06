import React from 'react'
import { GridList, GridListTile, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { Link } from 'react-router-dom'
import { Loading, useListContext } from 'react-admin'
import clsx from 'clsx'
import { Artwork } from '../common/Artwork'
import { OverflowTooltip, useGetHandleArtistClick } from '../common'

// CUSTOM (not part of official Navidrome)
// Shows artists as a grid of square photos with the name underneath.

const useStyles = makeStyles(
  (theme) => ({
    root: { margin: '20px', display: 'grid' },
    tile: { textDecoration: 'none', display: 'block' },
    photoBox: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: theme.palette.type === 'dark' ? '#333' : '#ddd',
      transition: 'transform 150ms ease-out',
      '&:hover': { transform: 'scale(1.03)' },
    },
    photo: { width: '100%', height: '100%' },
    name: {
      marginTop: '8px',
      fontSize: '15px',
      fontWeight: 500,
      textAlign: 'center',
      color: theme.palette.type === 'dark' ? '#eee' : 'black',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    subtitle: {
      fontSize: '12px',
      textAlign: 'center',
      color: theme.palette.type === 'dark' ? '#c5c5c5' : '#696969',
    },
    missing: { opacity: 0.3 },
  }),
  { name: 'NDArtistGridView' },
)

// How many photos across, by screen size.  <-- change these numbers to resize
const getColsForWidth = (width) => {
  if (width === 'xs') return 2 // phone
  if (width === 'sm') return 3 // small tablet
  if (width === 'md') return 4 // tablet / small laptop
  return 6 // desktop (your choice: 6 across)
}

const ArtistTile = ({ record, link }) => {
  const classes = useStyles()
  if (!record) return null
  return (
    <Link
      to={link}
      className={clsx(classes.tile, record.missing && classes.missing)}
    >
      <div className={classes.photoBox}>
        <Artwork
          record={record}
          fit="cover"
          className={classes.photo}
          title={record.name}
        />
      </div>
      <OverflowTooltip title={record.name}>
        <Typography className={classes.name}>{record.name}</Typography>
      </OverflowTooltip>
      {record.albumCount != null && (
        <Typography className={classes.subtitle}>
          {record.albumCount} {record.albumCount === 1 ? 'album' : 'albums'}
        </Typography>
      )}
    </Link>
  )
}

const ArtistGridView = ({ width }) => {
  const classes = useStyles()
  const { ids, data } = useListContext()
  const handleArtistLink = useGetHandleArtistClick(width)
  if (!ids || !data) return <Loading />
  return (
    <div className={classes.root}>
      <GridList
        component={'div'}
        cellHeight={'auto'}
        cols={getColsForWidth(width)}
        spacing={24}
      >
        {ids.map((id) => (
          <GridListTile key={id}>
            <ArtistTile record={data[id]} link={handleArtistLink(id)} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

export default withWidth()(ArtistGridView)
