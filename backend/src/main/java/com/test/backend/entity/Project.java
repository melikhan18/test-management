package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

/**
 * Project entity representing projects in the test management system.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_project_name", columnList = "name"),
    @Index(name = "idx_project_company", columnList = "company_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false, foreignKey = @ForeignKey(name = "fk_project_company"))
    private Company company;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Platform> platforms = new ArrayList<>();
    
    // Helper methods
    public void addPlatform(Platform platform) {
        platforms.add(platform);
        platform.setProject(this);
    }
    
    public void removePlatform(Platform platform) {
        platforms.remove(platform);
        platform.setProject(null);
    }
}
