# Training

## Setup training infrastructure on AWS

Login to AWS Console

Go to Services -> Cloudformation

Create new stack from template

[robocar-rally-lab/train/donkey-server-template.yml](https://github.com/jayway/robocar-rally-lab/blob/master/train/donkey-server-template.yml)

## Extract training data

SSH into the car
```bash
ssh pi@<your car hostname>.local
```

Create zip of the tubs 
```bash
zip -r /tmp/data.zip ~/d2/data/tub*
```

From your host, copy zip from car
```bash
scp <your car hostname>.local:/tmp/data.zip /tmp/data.zip
```

Upload to s3
```bash
aws s3 cp /tmp/data.zip s3://jayway-robocar-raw-data/<your car name>/data.zip
```

## Train your model 

SSH into your EC2 instance.
You find the hostname in cloudformation output on your stack.
```bash
ssh ubuntu@<your ec2 host name>
```

Copy data from s3
```bash
aws s3 cp s3://jayway-robocar-raw-data/<your car name>/data.zip /tmp/data.zip
```

Unzip your data
```bash
unzip /tmp/data.zip -d ~/d2/data
```

Train your model
```bash
python3.5 ~/d2/manage.py train --model ~/d2/models/<your car name>
```

## Tranfer your model

Download your model from your EC2 instance to your host
```bash
scp ubuntu@<your ec2 host name>:/d2/models/<your car name> /tmp/.
```

Transfer your model to the car
```bash
scp /tmp/<your car name> pi@<your car hostname>.local:/d2/models/.
```

## Test your model on the car
[More info on driving](http://docs.donkeycar.com/guide/get_driving/#drive-your-car)

```bash
ssh pi@<your car hostname>.local
cd ~/d2
python3.5 manage.py drive --model ~/d2/models/<your car name>
```

On your phone, browse to
```
http://<your car name>:8887
```

## TODO

General Deep Learning
- https://medium.com/@jjacquot/lessons-from-training-an-end-to-end-steering-network-cd14c897e8c9

### AWS Sagemaker
- https://github.com/awslabs/amazon-sagemaker-examples

Math:
- http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.161.3556&rep=rep1&type=pdf
- https://biasvariance.wordpress.com/2015/08/18/neural-networks-understanding-the-math-behind-backpropagation-part-i/
