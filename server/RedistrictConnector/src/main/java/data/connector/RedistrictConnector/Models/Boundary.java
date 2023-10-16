package data.connector.RedistrictConnector.Models;

import org.springframework.data.annotation.Id;

public class Boundary {

    @Id
    private String id;

    private Object data;

    public Boundary() {
    }

    public Boundary(Object data) {
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public Object getData() {
        return data;
    }
}
