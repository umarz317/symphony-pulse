
import React, { Component } from 'react'
import moment from 'moment'

import Scope from '../Scope/Scope'

// import styles from './BlockDetails.css'

export default class BlockDetails extends Component {
  UIUndersideButton () {
    if (this.props.controlType !== 'underside') {
      return (
        <div className='flip-view-container'>
          <button title='Show Merkle Tree' onClick={this.props.toggleUndersideView} className='flip-view' />
        </div>
      )
    } else {
      return (
        <div className='flip-view-container'>
          <button title='Show Block Top' onClick={this.props.toggleTopView} className='flip-view' />
        </div>
      )
    }
  }

  UITXDetails () {
    if (this.props.txSelected) {
      return (
        <div className='tx-details'>
          <div className='tx-details-border tx-details-border-tl' />
          <div className='tx-details-border tx-details-border-tr' />
          <div className='tx-details-border tx-details-border-bl' />
          <div className='tx-details-border tx-details-border-br' />

          <div className='tx-details-inner'>
            <h2><a target='_blank' href={'https://www.blockchain.com/btc/tx/' + this.props.txSelected.hash}>TX-{this.props.txSelected.hash}</a></h2>

            <span className='tx-detail-item'><strong>{ moment.unix(this.props.txSelected.time).format('YYYY-MM-DD HH:mm:ss') }</strong></span>
            <span className='tx-detail-item'><strong>{this.props.txSelected.size} bytes</strong></span>
            <span className='tx-detail-item'><h3>Relayed By:</h3> <strong>{this.props.txSelected.relayed_by}</strong></span>
            <span className='tx-detail-item'><h3>Fee:</h3> <strong>{this.props.txSelected.fee} BTC</strong></span>

            <ul className='input-output'>
              <li className='inputs'><h3>Inputs:</h3>
                <ul>
                  {this.props.txSelected.inputs.slice(0, 5).map(function (el, index) {
                    return <li key={index}>
                      { typeof el.prev_out !== 'undefined' ? el.prev_out.value / 100000000 : 0 } BTC</li>
                  })}
                  {this.props.txSelected.inputs.length > 5 ? '...' : ''}
                </ul>
              </li>

              <li className='outputs'><h3>Outputs:</h3>
                <ul>
                  {this.props.txSelected.out.slice(0, 5).map(function (el, index) {
                    return <li key={index}>{el.value / 100000000} BTC ({el.spent ? 'Spent' : 'Unspent'})</li>
                  })}
                  {this.props.txSelected.out.length > 5 ? '...' : ''}
                  <li className='out-total'><strong>Total:</strong> {(this.props.txSelected.outTotal).toFixed(2)} BTC</li>
                </ul>
              </li>
            </ul>

          </div>
        </div>
      )
    }
  }

  UICockpitButton () {
    if (this.props.controlType === 'fly') {
      return (
        <button title='Toggle Cockpit Controls' onClick={this.props.toggleTopView} className='toggle-cockpit-controls enter' />
      )
    } else {
      return (
        <button title='Toggle Cockpit Controls' onClick={this.props.toggleFlyControls} className='toggle-cockpit-controls leave' />
      )
    }
  }

  UICockpit () {
    if (this.props.controlType === 'fly') {
      return (
        <div className='hud'>
          <div className='coords'>
            <div className='posX'>X: { this.props.posX }</div>
            <div className='posY'>Y: { this.props.posY }</div>
            <div className='posZ'>Z: { this.props.posZ }</div>
          </div>
        </div>
      )
    }
  }

  render () {
    if (this.props.closestBlock) {
      const health = this.props.closestBlock.blockData.healthRatio > 1.0 ? 1.0 : this.props.closestBlock.blockData.healthRatio
      const healthInv = (1.0 - health)

      let className = 'block-details-container'

      if (this.props.controlType === 'fly') {
        className += ' cockpit'
      }

      return (
        <div className={className}>

          <div className='cockpit-border' />
          {this.UICockpit()}
          {this.UICockpitButton()}

          <div className='controls-container'>
            <div className='auto-pilot-controls'>
              <span title='Auto Pilot backwards in time' className='backward' onClick={() => this.props.toggleAutoPilotDirection('backward')} />
              <span title='Stop Auto Pilot' className='stop' onClick={() => this.props.stopAutoPilot()} />
              <span title='Auto Pilot forwards in time' className='forward' onClick={() => this.props.toggleAutoPilotDirection('forward')} />
            </div>
            {this.UIUndersideButton()}
          </div>
          {this.UITXDetails()}
          <div className='block-hash'>
            <h2>//BLOCK-{ this.props.closestBlock.blockData.height }</h2>
            <h3>{ this.props.closestBlock.blockData.hash }</h3>
          </div>

          <div className='block-details'>
            <h2 className='block-details-heading'>//BLOCK-{this.props.closestBlock.blockData.height}</h2>
            <div className='block-details-border' />
            <div><h3>Health:</h3>
              <div className='health-bar-container' title={healthInv}>
                <div
                  className='health-bar'
                  style={{
                    width: 100 * healthInv,
                    background: 'rgba(' + 255 * healthInv + ', ' + 255 * healthInv + ', ' + 255 * healthInv + ', 1.0)'
                  }}
                />
              </div>
            </div>
            <ul>
              <li><h3>No. of Tx:</h3> <strong>{ this.props.closestBlock.blockData.n_tx }</strong></li>
              <li><h3>Output Total:</h3> <strong>{ (this.props.closestBlock.blockData.outputTotal / 100000000).toFixed(2) } BTC</strong></li>
              <li><h3>Fees:</h3> <strong>{ (this.props.closestBlock.blockData.fee / 100000000).toFixed(2) } BTC</strong></li>
              <li><h3>Date:</h3> <strong>{ moment.unix(this.props.closestBlock.blockData.time).format('YYYY-MM-DD HH:mm:ss') }</strong></li>
              <li><h3>Bits:</h3> <strong>{ this.props.closestBlock.blockData.bits }</strong></li>
              <li><h3>Size:</h3> <strong>{ this.props.closestBlock.blockData.size / 1000 } KB</strong></li>
              <li><h3>Height:</h3> <strong>{ this.props.closestBlock.blockData.height }</strong></li>
              <li><h3>Merkle Root:</h3> <strong>{ this.props.closestBlock.blockData.mrkl_root.substring(0, 10) }</strong></li>
              <li><h3>Nonce:</h3> <strong>{ this.props.closestBlock.blockData.nonce }</strong></li>
              <li><h3>Version:</h3> <strong>{ this.props.closestBlock.blockData.ver }</strong></li>
              <li className='view-details'><h3><strong><a target='_blank' href={'https://www.blockchain.com/btc/block-height/' + this.props.closestBlock.blockData.height}>View Details</a></strong></h3></li>
            </ul>
            <Scope />
          </div>

        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }
}