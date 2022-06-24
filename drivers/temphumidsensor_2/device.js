'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class temphumidsensor2 extends ZigBeeDevice {

	async onNodeInit({zclNode}) {

		this.printNode();

		// measure_temperature
		zclNode.endpoints[1].clusters[CLUSTER.TEMPERATURE_MEASUREMENT.NAME]
		.on('attr.measuredValue', this.onTemperatureMeasuredAttributeReport.bind(this));
  
		// measure_humidity
		zclNode.endpoints[1].clusters[CLUSTER.RELATIVE_HUMIDITY_MEASUREMENT.NAME]
		.on('attr.measuredValue', this.onRelativeHumidityMeasuredAttributeReport.bind(this));

	}

	onTemperatureMeasuredAttributeReport(measuredValue) {
		const temperatureOffset = this.getSetting('temperature_offset') || 0;
		const parsedValue = this.getSetting('temperature_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
		this.log('measure_temperature | temperatureMeasurement - measuredValue (temperature):', parsedValue, '+ temperature offset', temperatureOffset);
		this.setCapabilityValue('measure_temperature', parsedValue + temperatureOffset);
	}

	onRelativeHumidityMeasuredAttributeReport(measuredValue) {
		const humidityOffset = this.getSetting('humidity_offset') || 0;
		const parsedValue = this.getSetting('humidity_decimals') === '2' ? Math.round((measuredValue / 100) * 100) / 100 : Math.round((measuredValue / 100) * 10) / 10;
		this.log('measure_humidity | relativeHumidity - measuredValue (humidity):', parsedValue, '+ humidity offset', humidityOffset);
		this.setCapabilityValue('measure_humidity', parsedValue + humidityOffset);
	}

	onDeleted(){
	this.log("temphumidsensor2 removed")
	}

}

module.exports = temphumidsensor2;
