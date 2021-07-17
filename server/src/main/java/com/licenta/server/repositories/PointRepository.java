package com.licenta.server.repositories;

import com.licenta.server.models.Point;
import com.licenta.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
}
