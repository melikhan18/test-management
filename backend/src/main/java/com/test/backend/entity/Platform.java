package com.test.backend.entity;

import com.test.backend.enums.PlatformType;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Platform entity representing different platforms (Android, iOS, Web, Service)
 * within a project.
 */
@Entity
@Table(name = "platforms", indexes = {
    @Index(name = "idx_platform_project", columnList = "project_id"),
    @Index(name = "idx_platform_name", columnList = "name")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_platform_name_project", columnNames = {"name", "project_id"})
})
public class Platform extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlatformType platformType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "platform", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Version> versions = new ArrayList<>();

    // Constructors
    public Platform() {}

    public Platform(String name, String description, PlatformType platformType, Project project) {
        this.name = name;
        this.description = description;
        this.platformType = platformType;
        this.project = project;
    }

    // Getters and Setters
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

    public PlatformType getPlatformType() {
        return platformType;
    }

    public void setPlatformType(PlatformType platformType) {
        this.platformType = platformType;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public List<Version> getVersions() {
        return versions;
    }

    public void setVersions(List<Version> versions) {
        this.versions = versions;
    }

    // Helper methods
    public void addVersion(Version version) {
        versions.add(version);
        version.setPlatform(this);
    }

    public void removeVersion(Version version) {
        versions.remove(version);
        version.setPlatform(null);
    }

    @Override
    public String toString() {
        return "Platform{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", platformType=" + platformType +
                ", project=" + (project != null ? project.getName() : null) +
                '}';
    }
}
