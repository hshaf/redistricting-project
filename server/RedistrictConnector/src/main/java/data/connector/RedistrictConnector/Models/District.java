package data.connector.RedistrictConnector.Models;

import java.util.List;


public class District {
  
  private Integer id;
  
  private Ensemble ensemble;

  private Cluster cluster;

  protected District() {}

  public Integer getId(){
    return this.id;
  }

  public Ensemble getEnsemble(){
    return this.ensemble;
  }

  public Cluster getCluster(){
    return this.cluster;
  }
}
