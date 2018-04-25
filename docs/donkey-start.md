# Machine Learning Track

Creating and training the neural network can be done both on your local computer and in the AWS cloud using the [AWS SageMaker](https://docs.aws.amazon.com/sagemaker) service.

## SageMaker

This lab assumes you're running the instructions on [AWS SageMaker](https://docs.aws.amazon.com/sagemaker).

Start with logging in to the AWS account.

### Create SageMaker Notebook Instance

First thing is to create a [Notebook Instance](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-notebooks-instances.html)

Use the following Instance Type:
- `ml.p2.xlarge`

Don't use a `VPC`.

### Clone the robocar git in the new instance

When you've created your new instance, open it up and create a new notebook (click `New`, `conda_python3`).

Clone the lab git by pasting in the following in the notebook:

```bash
git clone https://github.com/jayway/robocar-rally-lab
```

### Next

Open the first ML chapter:
[Donkey Train](../ml/donkey-train.ipynb)

## Local

You can also train locally, but the instructions are only tested on SageMaker.

See the [Donkey library](http://docs.donkeycar.com/guide/install_software/) docs for instructions:
- [Install Donkey](http://docs.donkeycar.com/guide/install_software/)
- [Train using Donkey](http://docs.donkeycar.com/guide/train_autopilot/)