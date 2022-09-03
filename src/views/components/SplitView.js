import React from "react";
import styled from "styled-components";
import { Component } from "react";
import Table from "./Table";
import SplitPane from "react-split-pane";

const Wrapper = styled.div`
  .Resizer {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Pane1 {
    background-color: blue;
  }
  .Pane2 {
    background-color: red;
  }
`;

class SplitView extends Component {
    constructor() {
        super();
        this.toggleBtmHeight = this.toggleBtmHeight.bind(this);
    }
    componentWillMount() {
        this.setState({
            btmHeight: ""
        });
    }
    toggleBtmHeight(topPaneHeight) {
        const maxHeight = 1000;
        const padding = 225;
        const btmPaneHeight = maxHeight - topPaneHeight - padding;
        this.setState({ btmHeight: btmPaneHeight + "px" });
    }

    render() {
        return (
            <Wrapper>
                <SplitPane
                    split="horizontal"
                    defaultSize="50%"
                    onChange={size => this.toggleBtmHeight(size)}
                    minSize={50}
                >
                    <Table color={"blue"} />
                    <Table
                        color={"red"}
                        btmHorizontal
                        bottomHeight={this.state.btmHeight}
                    />
                </SplitPane>
            </Wrapper>
        );
    }
}
export default SplitView;