

def dynamic_trust_cal(distance, no_of_zones_affected):
    """ Our dynamic metric in this case is the proximity of the source node to the
    event in question. This distance is measured in number of hops however we convert this to a grade ranging from 0 to 1
    based on the zone routing algorithm. We will use normalisation, where we rescale data to have values between 0 and 1 """

    #firstly, based on the total number of zones that will recieve message about an event in that area, we assign a total_score

    total_score = no_of_zones_affected
    """ next we create a rule stating that for each border node crossed, the score is decreased by 1.
    No. of border zones crossed can be calculated by dividing total number of hops in zones affected by distance
    """
    no_of_hops_per_zone = 2
    border_nodes_num = distance/no_of_hops_per_zone
    dynamic_score = total_score - border_nodes_num #7-4 =3

    #next we normalize the dynamic score to a 0 to 1 range using the max of total_score and min of 1
    normalized_score =(dynamic_score -1)/(no_of_zones_affected-1) # (x - minx)/ (max_x - minx)
    return normalized_score

def trust_level_calc(trust_level):
    """ we simply use the trust level of the source node saved in the hyperledger and using normalisation rescale data to
    values between 0 and 1"""
    max_trust_level = 10 #for high priority vehicles
    min_trust_level =1  #untrusted vehicles/criminals
    normalized_trust_level = (trust_level-min_trust_level)/(max_trust_level-min_trust_level)
    return normalized_trust_level

def get_security_status(vehicle_status):
    """ This is used to denoted status of the node in the system 1 being legitimate and 0 being node is revoked
    eg: when the police puts out an apb on a vehicle. """
    if vehicle_status== 'legitimate':
        return 1
    elif vehicle_status == 'revoked':
        return 0

def event_specific_trust_calc(event_type):
    """ for certain event type this could be used in place of the default trust level
     eg: a vehicle getaway chase, police cars will have a higher event specific trust than the rest of the nodes &
     for a fire on the road, firetrucks have more. When there is no specific event type like
      this, the default trust level is used .In our current system, the general trust level classification such as high
      priority  accounts for this currently, however this can be implemented in future systems."""

def credibility_grade(dynamic_metric,trust_level,security_status):
    credibility = (dynamic_metric +trust_level + security_status)/3
    return credibility

if __name__ == '__main__':
    """ message from source nodes are ussually tagged with source id, distance & event type. other metrics like number of zones affected,trust level 
    can be obtained by querying the hyperledger on the rsu"""
    message = { "event_type":"Accident" , "location":"Pembina North", "Source_ID": "vxcvrt34", "distance": 6,}
    #trust level & no. of zones to be affected is obtained from the RSU
    RSU_message= {"source_trust_level":6,"Num_of_zones_affected":7, "status":"legitimate"}
    #calculate credibility metrics
    dynamic_metric = dynamic_trust_cal(message["distance"],RSU_message["Num_of_zones_affected"])
    trust_level = trust_level_calc(RSU_message["source_trust_level"])
    security_status = get_security_status(RSU_message["status"])
    #calculate credibility
    credibility= credibility_grade(dynamic_metric,trust_level,security_status)
    print("Credibility of message from vehicle %s from range 0 to 1 is %s" %(message["Source_ID"],credibility))

