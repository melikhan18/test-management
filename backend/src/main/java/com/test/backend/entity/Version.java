package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Version entity representing project versions in the test management system.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "versions", indexes = {
    @Index(name = "idx_version_name", columnList = "version_name"),
    @Index(name = "idx_version_project", columnList = "project_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Version extends BaseEntity {
    
    @Column(name = "version_name", nullable = false, length = 50)
    private String versionName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_version_project"))
    private Project project;
}
