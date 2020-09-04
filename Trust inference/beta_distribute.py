import statistics


def get_mean_and_sd(x):

    #return(0.01,0.034)
    return (0.05,0.7)
    #return(statistics.stdev(x),statistics.mean(x))
# estimate parameters of beta dist.
def getAlphaBeta(mu, sigma):
    alpha = mu**2 * ((1 - mu) / sigma**2 - 1 / mu)

    beta = alpha * (1 / mu - 1)

    return {"alpha": alpha, "beta": beta}

#i recieved messages from 20 vehicles and calculated their credibility scores
credibility_scores = [0.6,0.5,0.3,0.2,0.3,0.4,0.7,0.8,0.6,0.2,0.5,0.2,0.4,0.4,0.7,0.3,0.5,0.6,0.2,0.3]
Sd,mean = get_mean_and_sd(credibility_scores)

print(getAlphaBeta(mean, Sd))
#print(mean,Sd)