import React from 'react';

const observer = (Component, observableFactory, defaultState) => {
    class WrappedComponent extends React.Component {
        constructor() {
            super();
            this.state = defaultState;
            this.props$ = observableFactory(this.props, this.state);
        }

        render() {
            return <Component {...this.props} {...this.state} />
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        componentDidMount() {
            this.subscription = this.props$.subscribe(value => this.setState(value));
        }
    }

    return WrappedComponent;
}

export default observer;