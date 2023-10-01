package data.connector.RedistrictConnector.Models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Ensemble {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;

  private String state;

  @OneToMany(mappedBy = "ensemble")
  private List<Cluster> clusters = new ArrayList<Cluster>(); //Is this right?

  @OneToMany(mappedBy = "ensemble")
  private List<District> districts = new ArrayList<District>();

  
  protected Ensemble() {}

  public Ensemble(String state){
    this.state = state;
  }

  public String getState(){
    return this.state;
  }

  public Integer getId(){
    return this.id;
  }

  public List<Cluster> getClusters(){ //Maybe fix this
    // if(this.clusters == null){
    //   this.clusters = new ArrayList<Cluster>();
    // }
    return this.clusters;
  }

  public List<District> getDistricts(){ //Maybe fix this
    // if(this.districts == null){
    //   this.districts = new ArrayList<District>();
    // }
    return this.districts;
  }

}
