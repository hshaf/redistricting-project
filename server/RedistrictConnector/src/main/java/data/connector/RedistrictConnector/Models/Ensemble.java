package data.connector.RedistrictConnector.Models;

import java.util.ArrayList;
import java.util.List;


//javaee chapter 26
public class Ensemble {
  

  private Integer id;

  private String state;

  private List<Cluster> clusters = new ArrayList<Cluster>(); //Is this right?

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
