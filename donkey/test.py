#!/usr/bin/env python3

import donkeycar as dk
from donkeycar.parts.iot import Iot

def main(cfg):
    V = dk.vehicle.Vehicle()

    # Add iot part
    V.mem['angle'] = 3
    V.mem['throttle'] = 11
    V.add(Iot(cfg.IOT_CONFIG_PATH), inputs=['angle', 'throttle'], threaded=True)
    
    #run the vehicle
    V.start(rate_hz=cfg.DRIVE_LOOP_HZ, 
            max_loop_count=cfg.MAX_LOOPS)


if __name__ == '__main__':
  cfg = dk.load_config()
  main(cfg)