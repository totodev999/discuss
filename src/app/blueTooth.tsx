'use client';

import { useEffect, useState } from 'react';

export default function Bluetooth() {
  const [isBlueToothAvailable, setIsBlueToothAvailable] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice>();
  const getBluetooth = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'],
      });
      console.log(device);
      setDevice(device);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    navigator.bluetooth.getAvailability().then((isBluetoothAvailable) => {
      setIsBlueToothAvailable(isBluetoothAvailable);
    });
  }, []);
  useEffect(() => {
    device?.gatt
      ?.connect()
      .then((server) => {
        console.log(server);
        server.getPrimaryServices().then((services) => {
          console.log(services);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [device]);

  return (
    <div>
      <div>{`${isBlueToothAvailable}`}</div>
      <button
        className="bg-blue-400 border rounded pt-1 pb-1 pl-2 pr-2 hover:bg-blue-600 duration-700 disabled:bg-gray-400 text-white"
        disabled={!isBlueToothAvailable}
        onClick={getBluetooth}
      >
        許可
      </button>
    </div>
  );
}
