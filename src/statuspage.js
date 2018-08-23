const axios = require('axios')
const debug = require('debug')('StatusPage')
const moment = require('moment')
const qs = require('qs')

class StatusPage {
  constructor(apiKey, pageId) {
    this.now = moment
    this.apiKey = apiKey
    this.pageId = pageId
    this.instance = axios.create({
      baseURL: 'https://api.statuspage.io',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `OAuth ${this.apiKey}`
      }
    })
  }

  generateMetricPostPath(metricId) {
    return this.generatePagePath() + `/metrics/${metricId}/data.json`
  }

  generatePagePath() {
    return `/v1/pages/${this.pageId}`
  }

  generateRequestParameters(val) {
    return `data[timestamp]=${this.now()}&data[value]=${val}`
  }

  generateComponentPath(componentId) {
    return this.generatePagePath() + `/components/${componentId}.json`
  }

  generateComponentStatusPayload(status) {
    return `component[status]=${status}`
  }

  generateCreateComponentPayload(name) {
    return `component[name]=${name}`
  }

  generateComponentsUrl() {
    return this.generatePagePath() + '/components.json'
  }
  
  generateSubscriberPath(subscriberId) {
    return this.generatePagePath() + `/subscribers/${subscriberId}.json`
  }

  generateSubscriberPath(subscriberId) {
    return this.generatePagePath() + `/subscribers/${subscriberId}.json`
  }

  generateSubscriberUrl() {
    return this.generatePagePath() + '/subscribers.json'
  }

  generateSubscriberPayload(subscriber) {
    return qs.stringify({subscriber}, {encode: false})
  }

  updateMetric(metricId, val) {
    return this.instance.post(
      this.generateMetricPostPath(metricId),
      this.generateRequestParameters(val)
    )
  }

  updateComponentState(componentId, status) {
    return this.instance.patch(
      this.generateComponentPath(componentId),
      this.generateComponentStatusPayload(status)
    )
  }

  getComponents = async () => {
    const res = await this.instance.get(
      this.generateComponentsUrl()
    )

    return res.data
  }

  createComponent(componentName) {
    return this.instance.post(
      this.generateComponentsUrl(),
      this.generateCreateComponentPayload(componentName)
    )
  }

  deleteComponent(componentId) {
    return this.instance.delete(
      this.generateComponentPath(componentId)
    )
  }

  createSubscriber(subscriber) {
    return this.instance.post(
      this.generateSubscriberUrl(),
      this.generateSubscriberPayload(subscriber)
    )
  }

  deleteSubscriber(subscriberId) {
    return this.instance.delete(
      this.generateSubscriberPath(subscriberId)
    )
  }

  log(msg) {
    debug(msg)
  }
}

export default StatusPage
export {
  StatusPage
}
