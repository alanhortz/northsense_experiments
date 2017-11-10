var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
    peripheral.discoverServices(['180f'], function(error, services) {
      var batteryService = services[0];
      console.log('discoveredBatter service');

      batteryService.discoverCharacteristics(['2a19'], function(error, characteristics) {
        var batteryLevelCharacteristic = characteristics[0];
        console.log('discovered Battery Level characteristic');

        batteryLevelCharacteristic.on('data', function(data, isNotification) {
          console.log('battery level is now: ', data.readUInt8(0) + '%');
        });

        // to enable notify
        batteryLevelCharacteristic.subscribe(function(error) {
          console.log('battery level notification on');
        });
      });
    });
  });
});