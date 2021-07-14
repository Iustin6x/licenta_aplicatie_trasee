package com.licenta.server.repositories;

import java.util.Optional;

import com.licenta.server.models.ERole;
import com.licenta.server.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(ERole name);
}
