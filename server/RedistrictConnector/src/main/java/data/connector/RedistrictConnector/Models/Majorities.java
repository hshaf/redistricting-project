package data.connector.RedistrictConnector.Models;

public class Majorities {
    private Integer majBlack;
    
    private Integer majNative;
    
    private Integer majAsian;
    
    private Integer majPacific;
    
    private Integer majHispanic;
    
    private Integer totalMajMin;

    public Integer getMajBlack(){
        return this.majBlack;
    }

    public Integer getMajNative(){
        return this.majNative;
    }

    public Integer getMajAsian(){
        return this.majAsian;
    }

    public Integer getMajPacific(){
        return this.majPacific;
    }

    public Integer getMajHispanic(){
        return this.majHispanic;
    }

    public Integer getTotalMajMin(){
        return this.totalMajMin;
    }
}
