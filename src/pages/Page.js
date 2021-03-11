import PropTypes from 'prop-types'
import { Component } from 'react'

class Page extends Component {
    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
        loading: PropTypes.bool,
        currentSection: PropTypes.string,
        updateAppState: PropTypes.func,
    }

    UNSAFE_componentWillMount() {
        this.pageMounted = true

        // update section on side bar
        if (this.context.currentSection !== this.props.sectionKey) {
            this.context.updateAppState({
                currentSection: this.props.sectionKey,
            })
        }
    }

    componentWillUnmount() {
        this.pageMounted = false
    }

    isPageMounted() {
        return this.pageMounted
    }
}

export default Page
