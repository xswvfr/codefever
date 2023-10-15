// core
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// components
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { plCheck } from '@pgyer/icons'
import FilterGenerator from 'APPSRC/helpers/FilterGenerator'
import UAC from 'APPSRC/config/UAC'
import { injectIntl } from 'react-intl'
import Constants from 'APPSRC/config/Constants'

// style
const styles = theme => ({
  menu: {
    top: theme.spacing(8) + 1 + 'px !important',
    width: theme.spacing(34) + 'px !important',
    height: theme.spacing(40),
    boxShadow: '0px 20px 40px 0px rgba(66, 72, 86, 0.1)'
  },
  button: {
    position: 'relative',
    maxWidth: '100%',
    paddingRight: theme.spacing(3),
    '& > span': {
      display: 'list-item',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    '& svg': {
      position: 'absolute',
      right: theme.spacing(1),
      top: '10px'
    }
  },
  listIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: theme.spacing(2) + 'px'
  },
  title: {
    color: theme.palette.text.lighter,
    fontSize: theme.spacing(1.5) + 'px',
    padding: theme.spacing(1) + 'px ' + theme.spacing(2) + 'px'
  },
  checked: {
    color: theme.palette.primary.main
  }
})

class GroupRepositoryMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      anchorElement: null,
      repositoryList: this.props.repositoryList,
      groupList: this.props.groupList,
      enterMenu: false,
      enterButton: false
    }
  }

  componentDidMount () {}

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.repositoryList !== nextProps.repositoryList ||
      this.props.groupList !== nextProps.groupList
    ) {
      this.setState({
        repositoryList: nextProps.repositoryList,
        groupList: nextProps.groupList
      })
    }

    return true
  }

  getToRepository (repositoryInfo) {
    this.initAnchor()
    this.props.history.push('/' + repositoryInfo.group.name + '/' + repositoryInfo.name + '/')
  }

  getToGroup (groupInfo) {
    this.initAnchor()
    this.props.history.push('/groups/' + groupInfo.name + '/')
  }

  initAnchor () {
    this.setState({
      anchorElement: null,
      enterButton: false,
      enterMenu: false
    })
  }

  render () {
    const { classes, intl, history, type, currentRepositoryKey, currentGroupKey } = this.props
    const { repositoryList, groupList } = this.state

    const repositoryItems = repositoryList
      .filter(FilterGenerator.withPermission(UAC.PermissionCode.REPO_READ))
      .map((item, key) => (
        <MenuItem key={'r' + key} onClick={(ev) => { this.getToRepository(item) }} >
          <ListItemIcon>
            { item.icon
              ? <Avatar variant='square' className={classes.listIcon} src={Constants.HOSTS.STATIC_AVATAR_PREFIX + item.icon} />
              : <Avatar variant='square' className={classes.listIcon}>{item.name.substr(0, 1).toUpperCase()}</Avatar>
            }
          </ListItemIcon>
          <ListItemText disableTypography primary={item.group.displayName + '/' + item.displayName} />
          {item.id === currentRepositoryKey && <FontAwesomeIcon icon={plCheck} className={classes.checked} />}
        </MenuItem>)
      )

    const GroupItems = groupList
      .filter(FilterGenerator.withPermission(UAC.PermissionCode.REPO_READ))
      .map((item, key) => (
        <MenuItem key={'g' + key} onClick={(ev) => { this.getToGroup(item) }} >
          <ListItemIcon>
            { item.icon
              ? <Avatar variant='square' className={classes.listIcon} src={Constants.HOSTS.STATIC_AVATAR_PREFIX + item.icon} />
              : <Avatar variant='square' className={classes.listIcon}>{item.name.substr(0, 1).toUpperCase()}</Avatar>
            }
          </ListItemIcon>
          <ListItemText disableTypography primary={item.displayName} />
          {item.id === currentGroupKey && !currentRepositoryKey && <FontAwesomeIcon icon={plCheck} className={classes.checked} />}
        </MenuItem>)
      )

    return (
      <span>
        {((type === 'repository' &&
          (repositoryList.length + groupList.length)) ||
          (type === 'group' &&
          groupList.length))
          ? <Button
            color='inherit'
            aria-owns={'menu-' + type}
            aria-haspopup='true'
            className={classes.button}
            onClick={() => {
              this.initAnchor()
              history.push(type === 'repository' ? '/repositories' : '/groups')
            }}
            onMouseEnter={(ev) => {
              this.setState({
                enterButton: true,
                anchorElement: ev.currentTarget
              })
            }}
            onMouseLeave={() => {
              this.setState({ enterButton: false })
              setTimeout(() => !this.state.enterMenu && this.initAnchor(), 100)
            }}
          >
            { type === 'repository' && intl.formatMessage({ id: 'menu.repository_pl' })}
            { type === 'group' && intl.formatMessage({ id: 'menu.group_pl' })}
            <FontAwesomeIcon icon={faAngleDown} />
          </Button>
          : <Button
            color='inherit'
            aria-owns={'menu-' + type}
            aria-haspopup='true'
            onClick={() => { history.push(type === 'repository' ? '/repositories/new' : '/groups/new') }}
          >
            { type === 'repository' && intl.formatMessage({ id: 'label.newRepository' })}
            { type === 'group' && intl.formatMessage({ id: 'label.newGroup' })}
          </Button>}

        {((type === 'repository' &&
          (repositoryList.length + groupList.length) > 0) ||
          (type === 'group' &&
          groupList.length > 0)) &&
        <Menu
          id={'menu-' + type}
          anchorEl={this.state.anchorElement}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          open={Boolean(this.state.anchorElement)}
          onClose={(ev) => { this.setState({ anchorElement: null }) }}
          PaperProps={{ className: classes.menu }}
          getContentAnchorEl={null}
          transitionDuration={0}
          onMouseEnter={() => { this.setState({ enterMenu: true }) }}
          onMouseLeave={() => this.initAnchor()}
        >
          <Grid className={classes.title}>
            <Typography variant='caption' component='div'>
              { type === 'repository' && intl.formatMessage({ id: 'label.repository' })}
              { type === 'group' && intl.formatMessage({ id: 'label.group' })}
            </Typography>
          </Grid>
          { type === 'repository' && repositoryItems }
          { type === 'group' && GroupItems }
        </Menu> }
      </span>
    )
  }
}

GroupRepositoryMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  // dispatchEvent: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  repositoryList: PropTypes.array.isRequired,
  groupList: PropTypes.array.isRequired,
  currentRepositoryKey: PropTypes.string,
  currentGroupKey: PropTypes.string,
  intl: PropTypes.object.isRequired,
  type: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
  return {
    repositoryList: state.DataStore.repositoryList,
    groupList: state.DataStore.groupList,
    currentRepositoryKey: state.DataStore.currentRepositoryKey,
    currentGroupKey: state.DataStore.currentGroupKey
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // dispatchEvent: (event) => { dispatch(event) }
  }
}

export default injectIntl(
  withStyles(styles)(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps)(GroupRepositoryMenu)
    )
  )
)
