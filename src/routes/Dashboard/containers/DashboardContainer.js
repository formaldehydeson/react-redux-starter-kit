import React from 'react'
import { connect } from 'react-redux'
import {
  dashboardVisitIncrement,
  dashboardAddItem,
  dashboardEditItem,
  dashboardReorderItems
} from '../modules/dashboard'
/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the dashboard:   */

import Dashboard from 'components/Dashboard'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  dashboardVisitIncrement: () => dashboardVisitIncrement(1),
  dashboardAddItem: (value) => dashboardAddItem(value),
  dashboardEditItem: (value) => dashboardEditItem(value),
  dashboardReorderItems: (value) => dashboardReorderItems(value)
}

const mapStateToProps = (state) => ({
  dashboard: state.dashboard
})

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.inputOnChange = this.inputOnChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.itemOnEdit = this.itemOnEdit.bind(this)
    this.handleOnDragStart = this.handleOnDragStart.bind(this)
    this.handleOnDrop = this.handleOnDrop.bind(this)
    this.handleOnDragOver = this.handleOnDragOver.bind(this)

    this.state = {
      inputValue: '',
      editedItemIndex: null,
      draggedItemIndex: null
    }
  }

  componentDidMount() {
      this.props.dashboardVisitIncrement();
  }

  handleOnDragStart (e) {
    const id = e.target.id
    this.setState({ draggedItemIndex: id })
  }

  handleOnDragOver (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move';
    //See the section on the DataTransfer object.
    //You can add more logic here if required
  }

  handleOnDrop (e) {
    const droppedItemId = e.currentTarget.id
    let reorderVal= {
      start: parseInt(this.state.draggedItemIndex),
      end: parseInt(droppedItemId)
    }

    // the div ids have to be numbers to reorder correctly
    // and the start and end value has to be different (otherwise reorder is not required)
    const reorderIsCorrect = !isNaN(reorderVal.start) && !isNaN(reorderVal.end) && reorderVal.start !== reorderVal.end

    if (reorderIsCorrect) {
      this.props.dashboardReorderItems(reorderVal)
    }

    this.setState({ draggedItemIndex: null})
  }

  inputOnChange(e) {
    this.setState({ inputValue: e.target.value })
  }

  itemOnEdit(itemIndex) {
    const editedItem = this.props.dashboard.dashboardItems[itemIndex]
    this.setState({ inputValue: editedItem.label, editedItemIndex: itemIndex })
  }

  onSubmit(e) {
    e.preventDefault()
    const val = this.state.inputValue
    const editedItemIndex = this.state.editedItemIndex
    if (val && editedItemIndex !== null) {
      this.props.dashboardEditItem({ val, editedItemIndex })
      this.setState({ inputValue: '', editedItemIndex: null})
    }
    else if(val) {
      this.props.dashboardAddItem(val)
      this.setState({ inputValue: '' })
    }
    else {
      alert (`Value can't be empty`)
    }
  }
  render () {
    return (
        <Dashboard {...this.props}
          handleOnDragOver={this.handleOnDragOver}
          handleOnDrop={this.handleOnDrop}
          handleOnDragStart={this.handleOnDragStart}
          editedItemIndex={this.state.editedItemIndex}
          itemOnEdit={this.itemOnEdit}
          inputValue={this.state.inputValue}
          inputOnChange={this.inputOnChange}
          onSubmit={this.onSubmit} />
    );
  }
}

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const dashboard = (state) => state.dashboard
    const tripleCount = createSelector(dashboard, (count) => count * 3)
    const mapStateToProps = (state) => ({
      dashboard: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapActionCreators)(DashboardContainer)
