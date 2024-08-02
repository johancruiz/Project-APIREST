package com.tidyday.TidyDay_Backend.repository;

import com.tidyday.TidyDay_Backend.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, String> {

    Optional<Project> findById(String id);
}
