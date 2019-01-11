import React, { Component } from "react";

import { decay, listen, pointer, transform, value } from "popmotion";

const innerStyle = {
  width: 2000,
  height: 100,
  background:
    "linear-gradient(to right, orange , yellow, green, cyan, blue, violet)"
};

const buttonStyle = {
  width: 100,
  zIndex: 10,
  position: "absolute",
  top: 0,
  bottom: 0
};

const leftButton = {
  ...buttonStyle,
  left: 0,
  background: "linear-gradient(to right, #ffffff, transparent)"
};

const rightButton = {
  ...buttonStyle,
  right: 0,
  textAlign: "right",
  background: "linear-gradient(to right, transparent, #ffffff)"
};

export default class App extends Component {
  state = {
    childrenWidth: 0
  };

  scrollOffsetInitial = 0;
  listX = value(0, value => {
    if (this.list && this.list.current) {
      this.list.current.scrollTo({
        left: value
      });
      this.scrollOffsetInitial = value;
    }
  });
  list = React.createRef();

  componentDidMount() {
    let width = 0;
    for (let x of this.list.current.children) {
      width += x.clientWidth;
    }

    this.clampMovement = transform.clamp(0, width);

    this.setState({ childrenWidth: width });

    listen(this.list.current, "mousedown touchstart").start(() => {
      pointer({ x: -this.scrollOffsetInitial })
        .pipe(
          ({ x }) => -x,
          this.clampMovement
        )
        .start(this.listX);
    });

    listen(this.list.current, "mouseup touchend").start(() => {
      decay({
        from: this.listX.get(),
        velocity: this.listX.getVelocity() * 0.1
      })
        .pipe(this.clampMovement)
        .start(this.listX);
    });

    this.forceUpdate();
  }

  handleScroll = event => {
    this.scrollOffsetInitial = this.list.current.scrollLeft;
    this.list.current.scrollTo({
      left: this.list.current.scrollLeft
    });

    this.forceUpdate();
  };

  onPrevious = event => {
    this.scrollOffsetInitial =
      this.list.current.scrollLeft - this.list.current.clientWidth;
    this.list.current.scrollTo(this.scrollOffsetInitial, 0);

    this.forceUpdate();
  };

  onNext = event => {
    this.scrollOffsetInitial =
      this.list.current.scrollLeft + this.list.current.clientWidth;
    this.list.current.scrollTo(
      this.list.current.scrollLeft + this.list.current.clientWidth,
      0
    );

    this.forceUpdate();
  };

  render() {
    if (this.list.current) {
      console.log(this.list.current.scrollLeft, this.state.childrenWidth, this.list.current.clientWidth);
    }

    return (
      <section style={{ height: '100%' }}>
        {this.list.current && this.list.current.scrollLeft > 0 && (
          <Button style={leftButton} onClick={this.onPrevious}>
            Left
          </Button>
        )}

        {this.list.current && this.list.current.scrollLeft + this.list.current.clientWidth !== this.state.childrenWidth && (
          <Button style={rightButton} onClick={this.onNext}>
            Right
          </Button>
        )}

        <div
          ref={this.list}
          onScroll={this.handleScroll}
          style={{ overflow: "hidden" }}
        >
          <div style={innerStyle} />
        </div>
      </section>
    );
  }
}

function Button(props) {
  return (
    <div onClick={props.onClick} style={props.style}>
      {props.children}
    </div>
  );
}
