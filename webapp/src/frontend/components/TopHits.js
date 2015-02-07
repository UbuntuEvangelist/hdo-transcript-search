var React            = require('react');
var moment           = require('moment');
var searchDispatcher = require('../dispatchers/search');

var div              = React.DOM.div;
var h3               = React.DOM.h3;
var ol               = React.DOM.ol;
var li               = React.DOM.li;

moment.locale('nb');

module.exports = React.createClass({
    getInitialState: function () {
        return { hits: []};
    },

    componentDidMount: function () {
        this.dispatchToken = searchDispatcher.register(function (payload) {
            if (payload.actionType === 'searchResult') {
                this.setState({hits: payload.result.hits});
            } else if (payload.actionType === 'reset') {
                this.setState(this.getInitialState());
            }
        }.bind(this));
    },

    componentWillUnmount: function () {
        searchDispatcher.unregister(this.dispatchToken);
    },

    render: function () {
        var elements = this.state.hits.map(this.renderHit);

        return div(null,
            h3(null, 'Treff'),
            ol(null, elements)
        );
    },

    renderHit: function (hit, i) {
        var source    = hit._source;
        var timestamp = moment(source.time).format('LLL');
        var person    = source.name + ' (' + (source.party || source.title) + ')';

        return li({key: i, className: 'hit'},
                  div({className: 'pull-right'}, timestamp),
                  div(null, person),
                  div({className: 'text-muted text-small', dangerouslySetInnerHTML: {__html: hit.highlight.text}})
                 );
    }
});