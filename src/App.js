import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'React';

const PATH_BASE = 'https://hn.angolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

let url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 10,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://github.com/reactjs/redux',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];

const isSearched = (searchTerm) => (item) =>
    !searchTerm || item.title.toLocaleLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: null,
            searchTerm: '',
        };

        this.setSearchTopstories = this.setSearchTopstories.bind(this);
        this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this)
        this.onDismiss = this.onDismiss.bind(this);
    }

    onSearchSubmit() {
        const { searchTerm } = this.state;
        this.fetchSearchTopstories(searchTerm);
    }

    setSearchTopstories(result) {
        this.setState({ result })
    }

    fetchSearchTopstories(searchTerm) {
        fetch(url)
            .then(response => response.json())
            .then(result => this.setSearchTopstories(result));
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.fetchSearchTopstories(searchTerm);
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value })
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({
            result: { ...this.state.result, hits: updatedHits }
        });

    }

    render() {
        const { searchTerm, result } = this.state;

        if (!result) { return null; }

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSumbit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                { result &&
                    <Table
                        list={result.hits}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                    />
                }
                <Table
                    list={result.hits}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
            </div>
        );
    }
}

const Search = ({ value, onChange, children }) => {
    return (
        <form>
            {children} <input
            type="text"
            value={value}
            onChange={onChange}
        />
        </form>
    );
};

const Table = ({ list, pattern, onDismiss }) => {
    return (
        <div className="table">
            { list.filter(isSearched(pattern)).map(item =>
                <div key={item.objectID} className="table-row">
                        <span style={{ width: '40%' }}>
                            <a href={item.url}>{item.title}</a>
                        </span>
                    <span style={{ width: '30%' }}>{item.author}</span>
                    <span style={{ width: '10%' }}>{item.num_comments}</span>
                    <span style={{ width: '10%' }}>{item.points}</span>
                    <span>
                            <Button
                                onClick={() => onDismiss(item.objectID)}
                                classname="button-inline"
                            >
                                Dismiss
                            </Button>
                        </span>
                </div>
            )}
        </div>
    );
};

const Button = ({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type="button"
        >
            {children}
        </button>
    );
};

export default App;