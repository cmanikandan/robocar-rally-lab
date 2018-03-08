import os
import json
import threading
from collections import namedtuple
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

# TODO: Remove this and generate a python config file in create-device-cert.sh instead
def read_config(path):
  if not os.path.isfile(path):
    raise ValueError('Invalid config path {path}')
  with open(path) as f:
    return json.load(f, object_hook=lambda d: namedtuple('car', d.keys())(*d.values()))

class Iot:
  '''
  Publishes interesting metrics to AWS IoT

  The update() method is the callable invoked by the worker thread. Everything else 
  is run by the vehicle event loop, unless explicitly called by update().
  '''
  def __init__(self, config_path='/home/pi/certs/config.json', report_interval=0.500):
    c = read_config(config_path)
    self.client = AWSIoTMQTTClient(c.ClientId)
    self.client.configureEndpoint(c.Host, c.Port)
    self.client.configureCredentials(c.CaCert, c.PrivateKey, c.ClientCert)
    self.topic = '{}/{}'.format(c.ThingTypeName, c.ThingName)
    self.exit_flag = threading.Event()
    self.interval = report_interval
    self.angle = 0
    self.throttle = 0
    self.client.connect()

  def run(self, angle, throttle):
    self.publish(angle, throttle)

  def run_threaded(self, angle, throttle):
    '''Using naive synchronization, i.e. shared variables, between threads. Can be improved'''
    self.angle = angle
    self.throttle = throttle

  def update(self):
    '''Target callable of the worker thread'''
    while not self.exit_flag.wait(timeout=self.interval):
      self.publish(self.angle, self.throttle)

  def publish(self, angle, throttle):
    payload = json.dumps({'angle': angle, 'throttle': throttle })
    print('Publishing {} to {}'.format(payload, self.topic))
    self.client.publish(self.topic, payload, 0)

  def shutdown(self):
    self.exit_flag.set()
    self.client.disconnect()