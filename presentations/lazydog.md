# Machine Learning Cheat Sheet

| Term                       | Description                                           |
| -------                    | --------                                              |
| AI                     | Machines that mimic human/natural behavior            |
| ML                     | The ability to learn w.o. being explicitly programmed, i.e. by feeding the algorithm with data and have it learn. |
| Model                  | A flexible program/algorithm with parameters that can be tuned. |
| Training               | Tuning the **model**.                                 |
| Loss function          | Measures how bad a **model** is. It's the purpose of the training step to minimize the **loss function**. |
| Training and test data | The data used to train a model is usually divided up in two parts; the **training set** and the **test set** (also called **validation set**). The **training set** is used to train the model, while the **test set** is used to measure how well the model performs. |
| Overfitting            | When the training failed to generalize the model, i.e. picking up features in the data that are not relevant to the goal. As a consequence, the model behaves much better on trained data than on test/new data. An analogy; *screwing up on exam despite doing well on test exams*. |
| Target/Label           | ?                                                     |
| Feature/Example        | ?                                                     |
| Prediction/Inference   | ?                                                     |
| Epoch                  | One full training cycle on the **training set**. In general, the parameters of the model are updated after each epoch. |
| Batch size             | The number of **examples** per batch. In batch training, the parameters of the model are updated after each batch in the epoch. |
| Steps / Steps per epoch | In batch training, `s = t / b`,  where `s` is steps per epoch, `t` is training set size and `b` is batch size. | |

| ML learning styles | Description                                                   |
| ---                | ---                                                           |
| General            | A way of organizing/categorizing ML algorithms based on the way it interacts with the environment/input data. Useful in the way it makes you reflect over the roles of the input data and the model. The most common ones are **Supervised learning**, **Unsupervised learning** and **Semi-supervised learning**. |
| **Supervised learning**    | The ML task of predicting **targets**/**labels** given input data (**features**/**examples**). A model is prepared through a learning process where it is required to make predictions based on input, and is corrected when the predictions are wrong. Includes many of the most commonly known ML problems such as **Decision Trees**, **Regression** and **Classification**. |
| **Unsupervised learning**  | ML learning style. If **Supervised learning** is feeding a **model** a bunch of examples and corresponding target values, then **Unsupervised learning** is more like getting a dump of data and trying to draw some conclusions. In constrast to **Supervised learning**, there are no known results. An **unsupervised learning** algorithm prepares the model by deducing structures present in the input data. Common problems include **Clustering**, **Dimensionality reduction** and **Association rule learning**. |
| **Semi-supervised learning** | ML learning style. Input data is a mixture of **labeled** and **unlabeled** data. The model must learn both the structures to organize the data as well as make predictions. |

| ML algorithm types          | Description                                           |
| ---                         | ---                                                   |
| General                     | A way of organizing/categorizing ML algorithms based on similarity in terms of function. Hence, a specific algorithm can both belong to a type/group and a style (such as **supervised**). |
| **Regression**              | Supervised ML problem. Predicting real values based on **features**. Usually answers 'how much?' or 'how many?'. Common algorithms include **Logistic regression** and **Linear regression**. |
| **Classification**          | Supervised ML problem. Predicting a predefined category based on **features**. Usually answers 'is this a...?'. Common algorithm include **Back propagation neural network**. |
| **Neural networks**         | ? |
| **Deep Learning**           | ? |
| **Decision trees**          | ? |
| **Clustering**              | Unsupervised ML problem, e.g. grouping images into cats, dogs, etc. A common clustering algorithm is **k-means**. |
| **Bayesian networks**       | ? |
| **Reinforcement learning**  | ? |
| **Representation learning** | E.g: 'Rome - Italy + France = Paris'                  |

| Neural networks            | Description                                           |
| ---                        | ---                                                   |
| **Activation function**    | ? |
| **Convolution**            | ? |
| **relu**                   | ? |
| **Input layer**            | ? |
| **Hidden layer**           | ? |
| **Dense layer**            | ? |
| **Dropout layer**          | ? |
| **Flattened layer**        | ? |
| **Gradient decent**        | Minimize loss function commonly used in supervised learning. |