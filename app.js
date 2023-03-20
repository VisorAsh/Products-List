const PRODUCTS = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"},
    {category: "Home", price: "$9.99", stocked: true, name: "Chair"},
    {category: "Home", price: "$159.99", stocked: true, name: "TV"},
    {category: "Home", price: "$399.99", stocked: false, name: "Bed"}
]

// Avec le React.memo, on a définit une composante pure dont le render ne sera appelé que quand il y' aura un nouvel élement à afficher. (Ca ne se rajoute pas partout).

const ProductRow  = React.memo(function ProductRow ({product}) {
    const name = product.stocked ? product.name : <span className="text-danger">{product.name}</span>
    return <tr>
        <td>{name}</td>
        <td>{product.price}</td>
    </tr>
})

function ProductCategoryRow ({category}) {
    return <tr>
        <th colSpan="2" className="text-bold">{category}</th>
    </tr>
}

function ProductTable ({products, filterText, inStockOnly}) {
    const rows = []
    let lastCategory = null

    products.forEach(product => {
        if ((inStockOnly && !product.stocked) || product.name.indexOf(filterText) === -1) {
            return
        }
        if (product.category !== lastCategory) {
            lastCategory = product.category
            rows.push(<ProductCategoryRow key={lastCategory} category={lastCategory} />)
        }
        rows.push(<ProductRow key={product.name} product={product} />)
    })

    return <table className="table">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Prix</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
    </table>
}

class SearchBar extends React.Component {

    constructor (props) {
        super(props)
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleInStockChange = this.handleInStockChange.bind(this)
    }

    handleFilterTextChange (e) {
        this.props.onFilterTextChange(e.target.value)
    }

    handleInStockChange (e) {
        this.props.onStockChange(e.target.checked)
    }

    render () {
        const {filterText, inStockOnly} = this.props
        return <div className="mb-4">
            <div className="form-group">
                <input type="text" value={filterText} className="form-control" placeholder="Rechercher" onChange={this.handleFilterTextChange} />
            </div>
            <div className="form-check">
                <input type="checkbox" checked={inStockOnly} className="form-check-input" id="stock" onChange={this.handleInStockChange} />
                <label htmlFor="stock" className="form-check-label">Produits en stock seulement</label>
            </div>
        </div>
    }
}

class FilterableProductTable extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            filterText: '',
            inStockOnly: false
        }
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleInStockChange = this.handleInStockChange.bind(this)
    }

    handleFilterTextChange (filterText) {
        this.setState({filterText})
    }

    handleInStockChange (inStockOnly) {
        this.setState({inStockOnly})
    }

    render () {
        const {products} = this.props
        return <React.Fragment>
            <SearchBar 
                filterText = {this.state.filterText} 
                inStockOnly = {this.state.inStockOnly} 
                onFilterTextChange = {this.handleFilterTextChange}
                onStockChange = {this.handleInStockChange}
            />
            <ProductTable 
                products = {products}
                filterText = {this.state.filterText}
                inStockOnly = {this.state.inStockOnly} 
            />
        </React.Fragment> 
    }
}

ReactDOM.render(<FilterableProductTable products={PRODUCTS} />, document.querySelector("#app"))