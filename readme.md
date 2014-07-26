# What is a good driving from the passenger's point of view?

My defination of **smooth driving**:

Let $a(t)$ represents the function (or time series) of acceleration. A good driving means $a$ is continuous and its derivative function $a'$ is also continuous, i.e., function $a$ is at least of class $C^1$. ([Wiki: Smooth function](http://en.wikipedia.org/wiki/Smooth_function))

If a driving is smooth, there is no sudden braking, hard acceleration, and sharp bend, and more. In a word, smooth driving brings a perfect **passenger experience**.

# Goal of this repo

- Quantify the above defination, and evaluate the driving skill in real time.

- Design a social game based on the evaluation.

# Key problems

## Dynamic continuity measure for discrete time series

I didn't find any useful and practical theories about the problem. My current idea a simple threshold method.

Suppose that the data is obtained in time interval $\Delta{t}$, and let $\Delta{a'_m}$ represent the maximum allowed variation for $a'$ in $\Delta{t}$. Suppose the actual variation is $\Delta{a'}$ (absolute value). Whenever $\Delta{a'}>\Delta{a'_m}$ is detected, the driving score should be decreased according to $||\Delta{a'}-\Delta{a'_m}||$. 

## Score mapping

At any time, mapping the current continuity measure to an appropriate score (e.g., 100-mark system)


## Rating algorithm

After a challenge is performed, how to adjust the rating of the users?

- Elo rating is a good choice



