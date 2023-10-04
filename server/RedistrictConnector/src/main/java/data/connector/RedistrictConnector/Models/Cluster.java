package data.connector.RedistrictConnector.Models;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;


import java.util.ArrayList;
import java.util.List;

@Entity
public class Cluster {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;

  @ElementCollection(targetClass = String.class) //Good idea? Creates a new table
  private List<String> tags = new ArrayList<String>();

  @OneToMany(mappedBy = "cluster")
  private List<District>  districts = new ArrayList<District>();

  @ManyToOne(fetch = FetchType.LAZY)
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
