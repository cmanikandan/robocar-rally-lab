# Training

## Setup training infrastructure

Create stack from template in [robocar-rally-lab/train/donkey-server-template.yml](https://github.com/jayway/robocar-rally-lab/blob/master/train/donkey-server-template.yml)

## Copy data from car to S3

Create zip of the tubs
```bash
zip -r /tmp/data.zip ~/d2/data/tub*
```

Copy zip to your host
```bash
scp <your car hostname>.local:/tmp/data.zip /tmp/data.zip
```

Upload to s3
```bash
aws s3 cp /tmp/data.zip s3://jayway-robocar-raw-data/<your car name>/data.zip
```
## Copy data from S3 to instance

## Start training

## Copy model to Car

## Start car with model

```bash
python3 manage.py drive --model <your model>
```

## Browse to car

http://<your ca hostname>.local:8887
  
set max speed

choose pilot mode local angle

## TODO

General Deep Learning
- https://medium.com/@jjacquot/lessons-from-training-an-end-to-end-steering-network-cd14c897e8c9

### AWS Sagemaker
- https://github.com/awslabs/amazon-sagemaker-examples

Math:
- http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.161.3556&rep=rep1&type=pdf
- https://biasvariance.wordpress.com/2015/08/18/neural-networks-understanding-the-math-behind-backpropagation-part-i/
