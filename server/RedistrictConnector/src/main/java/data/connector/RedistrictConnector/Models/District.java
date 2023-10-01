package data.connector.RedistrictConnector.Models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class District {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;
  
  @ManyToOne(fetch = FetchType.LAZY)
  private Ensemble ensemble;

  @ManyToOne(fetch = FetchType.LAZY)
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
