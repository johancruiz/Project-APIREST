package com.tidyday.TidyDay_Backend.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @UuidGenerator
    @Column(name = "id", unique = true,updatable = false)
    private String id;
    private String title;
    private String description;
    private Date date;
    private String status;
    private String photoUrl;

}
