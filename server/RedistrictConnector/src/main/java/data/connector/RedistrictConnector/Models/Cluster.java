package data.connector.RedistrictConnector.Models;



import java.util.ArrayList;
import java.util.List;

public class Cluster {
  

  private Integer id;

  private List<String> tags = new ArrayList<String>();

  private List<District>  districts = new ArrayList<District>();

  private Ensemble ensemble;
  
  protected Cluster() {}

  public Cluster(String temp){ //Temporary constructor 

  }


  public Integer getId(){
    return this.id;
  }
  public Ensemble getEnsemble(){
    return this.ensemble;
  }

  public List<String> getTags(){
    return this.tags;
  }

  public List<District> getDistricts(){
    return this.districts;
  }


}
