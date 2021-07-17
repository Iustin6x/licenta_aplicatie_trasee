package com.licenta.server.repositories;


import com.licenta.server.models.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findAllByUserUsername(String username);
    List<Route> findAllByType(String type);

}
