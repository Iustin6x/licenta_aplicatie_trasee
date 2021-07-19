package com.licenta.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Table(	name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "distance")
    private Float distance;

    @Column(name = "speed")
    private Float speed;

    @Basic
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_date")
    private java.util.Date start_date;

    @Basic
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "finish_date")
    private java.util.Date finish_date;


    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(	name = "route_points",
            joinColumns = @JoinColumn(name = "route_id"),
            inverseJoinColumns = @JoinColumn(name = "point_id"))
    private List<Point> points= new ArrayList<Point>();


    @Column(name = "type")
    private String type;

    @ManyToMany()
    @JsonIgnore
    @JoinTable(	name = "user_follow_route",
            joinColumns = @JoinColumn(name = "route_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> followers= new ArrayList<User>();

    public Route() {
    }

    public Route(Long id, String name, String description, Float distance, Float speed, Date start_date, Date finish_date, User user, List<Point> points, String type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.distance = distance;
        this.speed = speed;
        this.start_date = start_date;
        this.finish_date = finish_date;
        this.user = user;
        this.points = points;
        this.type = type;
    }

    public Route(String name, String description, Float distance, Float speed, Date start_date, Date finish_date, User user, List<Point> points, String type) {
        this.name = name;
        this.description = description;
        this.distance = distance;
        this.speed = speed;
        this.start_date = start_date;
        this.finish_date = finish_date;
        this.user = user;
        this.points = points;
        this.type = type;
    }



    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getDistance() {
        return distance;
    }

    public void setDistance(Float distance) {
        this.distance = distance;
    }

    public Float getSpeed() {
        return speed;
    }

    public void setSpeed(Float speed) {
        this.speed = speed;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getFinish_date() {
        return finish_date;
    }

    public void setFinish_date(Date finish_date) {
        this.finish_date = finish_date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return "Route{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", distance=" + distance +
                ", speed=" + speed +
                ", start_date=" + start_date +
                ", finish_date=" + finish_date +
                ", user=" + user +
                ", points=" + points +
                ", type='" + type + '\'' +
                '}';
    }
}
