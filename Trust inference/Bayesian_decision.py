import matplotlib.pyplot as plt
import numpy as np
import pymc3
import scipy.stats as stats

if __name__ == '__main__':


    plt.style.use("ggplot")

    #parameter values for prior
    n = 100 #number of credibility scores
    z = 60# number of valid credibility scores (i.e scores >= 0.5)

    """Alpha and beta being = 12 implies a mean of 0.5 which will call neutral probablity (accident has an equal chance of happening or not) 
and standard deviation of 0.1 which denotes our uncertainty of this fair probability.This is calculated in our beta_distribute program and for the first event,
a neutral probability is used as the prior knowledge. some research paper suggest the use of statistical evidence, 
such as the probablity of occurrence of accidents in a location, however as our network evolves, our beta distribution parameters alpha & beta
will be calculated from credibility scores of previous accidents in that location"""
    alpha =  58.099999999999994
    beta = 24.9

    # How many iterations of the Metropolis
    # algorithm to carry out for MCMC
    iterations = 10000
    # Use PyMC3 to construct a model context
    basic_model = pymc3.Model()
    with basic_model:
        # Define our prior belief about the fairness of an accident happening or not in that location using a Beta distribution
        theta = pymc3.Beta("theta", alpha=alpha, beta=beta)

        # Define the Bernoulli likelihood function
        y = pymc3.Binomial("y", n=n, p=theta, observed=z)

        # Carry out the MCMC analysis using the Metropolis algorithm
        # Use Maximum A Posteriori (MAP) optimisation as initial value for MCMC
        start = pymc3.find_MAP()

        # Use the Metropolis algorithm (as opposed to NUTS or HMC, etc.)
        step = pymc3.Metropolis()

        # Calculate the trace
        trace = pymc3.sample(iterations, step, start, random_seed=1, progressbar=True)

    # Plot the posterior histogram from MCMC analysis
    bins=50

    plt.hist(
    trace["theta"], bins,
    histtype="step", normed=True,
    label="Posterior (MCMC)", color="red"
    )

    # Plot the analytic prior and posterior beta distributions
    x = np.linspace(0, 1, 100)
    plt.plot(
    x, stats.beta.pdf(x, alpha, beta),
     label="Prior (reports on tire skidding)", color="blue",
   )




    # Update the graph labels
    plt.legend(title="Parameters", loc="upper left")
    plt.xlabel("$\\theta$, Probability of Accident occurrence ")
    plt.ylabel("Density")
    plt.show()

    # Show the trace plot
    #pymc3.traceplot(trace)
    #plt.show()