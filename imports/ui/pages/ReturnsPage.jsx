// @flow

// Framework
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

// Components
import { Alert, Row, Col, Button, Card, ListGroup, ListGroupItem } from "reactstrap";
import Page from "../components/Page.jsx";

// Animation
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class HelpButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <button onClick={this.props.onClick}
          className="help-button">Talk to Someone</button>{' '}
      </div>
      );
  }
}

class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="help-modal">
      <div className="help-modal-header">
        <img alt="Help Guy" src="/images/unnamed.jpg" className="help-guy-image" />
      </div>
      <div className="help-modal-content">
          <h5 className="help-modal-text1">Need a hand?</h5>
          <p className="help-modal-text2">Push the call button and we'll gladly 
            put you in touch with one of our knowledgeable reps.</p>
          <button className="call-us-button">Call Us</button>
          <button className="close-help-button" onClick={this.props.onClick}>Close</button>
      </div>
      </div>
      );
  }
}

class ReturnDrawer extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      returnQuantity: this.props.quantity
    };
    this.state = this.initialState;
  }

  setQuantity(quant) {
    this.setState(() => ({ returnQuantity: quant }));
  }

  // when apply changes is clicked, hide drawer and update return quantities
  handleChangesButton() {
    this.props.onClick();
    this.props.updateReturnQuant(this.state.returnQuantity);
  }

  render() {
    const quantArr = [...Array(this.props.initialQuantity).keys()];

    // generate quantities; figure out which quantity
    // is currently selected, then highlight and add a checkmark
    var quant = quantArr.map(function(curr) {
      if (this.state.returnQuantity == curr+1) {
        return (
          <button key={curr} 
            className="return-picker-button return-picker-button-active"
            onClick={()=>this.setQuantity(curr+1)}>{curr+1}
              <p className="quantity-checkmark">&#10003;</p></button>
          );
      } else {
        return (
          <button key={curr} 
            className="return-picker-button"
            onClick={()=>this.setQuantity(curr+1)}>{curr+1}</button>
          );
      }
    }, this);
 
    return (
      <div key="return-drawer" className="return-drawer">
        <button className="back-button" onClick={this.props.onClick}>&larr;</button>
        <h3 className="return-drawer-title"> Return Quantity </h3>
        <ListGroup className="return-picker">
          {quant}
        </ListGroup>
         <button className="apply-changes-button"
          onClick={this.handleChangesButton.bind(this)}>Apply Changes</button>
      </div>
      );
  }
}

class SellerGroup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const products = this.props.products;

    return (
      <section className="seller-group">
        <section className="seller-group-header">
          <h5 className="seller-name">{this.props.seller}</h5>
          <p className="return-count">{this.props.sellerNumber} of {this.props.sellerCount}</p>
         </section>
          {products.map(products =>
                <ProductCard key={products.name} products={products} 
                toggleDrawer={this.props.toggleDrawer}
                updateSelectedItem={this.props.updateSelectedItem} 
                quantities={this.props.quantities} 
                updateReturnQuant={this.props.updateReturnQuant} />)}
      </section>
      );
  }
}

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      selectProduct: 0
    };
    this.state = this.initialState;
  }

  updateSelectedItem() {
    this.props.updateSelectedItem(this.props.products.name);
  }

  handleClick() {
    this.props.toggleDrawer();
    this.updateSelectedItem();
  }

  // selects the product for return, when toggled
  // set the return quantity to default either 1 or 0
  toggleSelectProduct() {
    this.updateSelectedItem();
    var toggle = 0;
    if (this.state.selectProduct == 0) {
      toggle = 1;
      this.props.updateReturnQuant(1, this.props.products.name);
    } else {
      this.props.updateReturnQuant(0, this.props.products.name);
    }
    this.setState(() => ({ selectProduct: toggle }))
  }

  checkLength(str) {
    if (str.length > 21) {
      return str.slice(0, 21) + "...";
    } else {
      return str;
    }
  }

  render() {
    const product = this.props.products;

    if (this.props.quantities !== null) {
      var returnQuantity = this.props.quantities[product.name];
    } else {
      var returnQuantity = 1;
    }

    if (this.state.selectProduct == 1) {
      var returnQuantityButton = <button className="product-button"
                onClick={this.handleClick.bind(this)}>
              <p className="product-button-title">Return Quantity</p>
              <p className="product-button-value">
                {returnQuantity} of {product.quantityPurchased} &nbsp;&nbsp;></p>
              </button>;

      var selectProductButton = <button
          className="select-product-button select-product-button-active"
        onClick={this.toggleSelectProduct.bind(this)}>
          <p className="product-checkmark">&#10003;</p>
        </button>;
    } else {
      var returnQuantityButton = <button className="product-button">
              <p className="product-button-title">Return Quantity</p>
              <p className="product-button-value">0 of {product.quantityPurchased} &nbsp;&nbsp;></p>
            </button>;

      var selectProductButton = <button className="select-product-button"
        onClick={this.toggleSelectProduct.bind(this)} />
    }

    return (
      <section className="product-card">
        <section className="product-card-left" />
        <section className="product-card-right">
          <div className="product-card-header">
            {selectProductButton}
            <p className="product-price">C${product.pricePerItem}</p>
            <p className="product-brand">{this.checkLength(product.brand)}</p>
            <p className="product-name">{this.checkLength(product.name)}</p>
          </div>
            <button className="product-button">
              <p className="product-button-title">Size</p> 
              <p className="product-button-value">{product.size}</p></button>
            <button className="product-button">
              <p className="product-button-title">Color</p>
              <p className="product-button-value">{product.color}</p></button>
            {returnQuantityButton}
        </section>
      </section>
    );
  }
}

class ReturnsPage extends Component {
  constructor(props) {
    super(props);
    // Initialize State
    this.initialState = {
      lastOrder: null,
      error: null,
      showHelp: 0,
      showDrawer: 0,
      initialQuantities: null,
      returnQuantities: null,
      selectedItem: null
    };
    this.state = this.initialState;
  }

  componentWillMount() {
    Meteor.call("orders.getLastOrder", (error, response) => {
      if (error) {
        this.setState(() => ({ error: error }));
      }
      this.setState(() => ({ lastOrder: response }));

      // Set up initial quantity purchased for each item
      if (response) {
        var initialQuantities = {};
        var returnQuantities = {};
        for (var i in response.merchantOrders) {
          for (var j in response.merchantOrders[i].items) {
            var name = response.merchantOrders[i].items[j].name;
            initialQuantities[name] = response.merchantOrders[i].items[j].quantityPurchased;
            // initial return quantity for an item defaults to 0
            returnQuantities[name] = 0;
          }
        }
        // keep initial quantities separate so the drawer can render the correct
        // number of options
        this.setState(() => ({ initialQuantities: initialQuantities,
          returnQuantities: returnQuantities }));
      }
    });
  }

  // when return quantities is selected for an item, that item becomes the
  // currently selected item so that the drawer knows which item to display
  updateSelectedItem(name) {
    this.setState(() => ({ selectedItem: name }));
  }

  updateReturnQuant(quant, itemName) {
    var oldQuants = this.state.returnQuantities;
    var newQuants = Object.assign({}, oldQuants);
    if (itemName) {
      newQuants[itemName] = quant;
    } else {
      newQuants[this.state.selectedItem] = quant;
    }
    this.setState(() => ({ returnQuantities: newQuants }));

  }

  toggleHelp() {
    var toggle = 0;
    if (this.state.showHelp == 0) {
      toggle = 1;
    }
    this.setState(() => ({ showHelp: toggle }))
  }

  toggleDrawer() {
    var toggle = 0;
    if (this.state.showDrawer == 0) {
      toggle = 1;
    }
    this.setState(() => ({ showDrawer: toggle }))
  }

  render() {
    const { lastOrder, error } = this.state;

    var sellerCount = 0;

    var SellerGroups = null;
    if (lastOrder !== null) {
      const sellers = lastOrder.merchantOrders;
      sellerCount = Object.keys(sellers).length;
      SellerGroups = sellers.map((sellers, i) =>
              <SellerGroup key={sellers.name} seller={sellers.name}
                sellerNumber={i+1} sellerCount={sellerCount}
                products={sellers.items} toggleDrawer={this.toggleDrawer.bind(this)}
                updateSelectedItem={this.updateSelectedItem.bind(this)}
                quantities={this.state.returnQuantities} 
                updateReturnQuant={this.updateReturnQuant.bind(this)} />)
    }
    
    if (this.state.showHelp == 1) {
      var help = React.createElement(HelpModal, {onClick: this.toggleHelp.bind(this)});
      var showHelp = React.createElement('div', {className: 'show-help'});
    } else {
      var showHelp = null;
      var help = null;
    }

    if (this.state.showDrawer == 1) {
      var drawer = React.createElement(ReturnDrawer, 
        {onClick: this.toggleDrawer.bind(this),
          initialQuantity: this.state.initialQuantities[this.state.selectedItem],
          quantity: this.state.returnQuantities[this.state.selectedItem],
          updateReturnQuant: this.updateReturnQuant.bind(this)});
    } else {
      var drawer = null;
    }

    return (
      <Page>
        <Col sm="5">
          <ReactCSSTransitionGroup
            transitionName="slide-in-left"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}> 
            {drawer}
          </ReactCSSTransitionGroup>
          <main className="main">
          <ReactCSSTransitionGroup
            transitionName="fade-in"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}> 
            {showHelp}
          </ReactCSSTransitionGroup>
            <section className="returns-header">
              <button className="back-button">&larr;</button>
              <Row>
                <p className="page-count">1 of 3</p>
              </Row>
              <Row>
                <h5 className="returns-header-text">How many items would you like to return?</h5>
              </Row>
            </section>
            <Row>
              <Col>
                <HelpButton onClick={() => this.toggleHelp()}
                  className="help-button" />
                <ReactCSSTransitionGroup
                  transitionName="fade-in"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}> 
                  {help}
                </ReactCSSTransitionGroup>
              </Col>
            </Row>
            <section className="item-list">
              <Row>
                <Col>
                  {SellerGroups}
                </Col>
              </Row>
              <Row>
                <Col>
                  {error}
                </Col>
              </Row>
            </section>
            <footer className="footer">
              <p className="footer-text">Terms and Conditions</p>
              <button className="footer-button">&rarr;</button>
            </footer>
          </main>
        </Col>
      </Page>
    );
  }
}

export default ReturnsPage;
