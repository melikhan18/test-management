package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Version entity representing platform versions in the test management system.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "versions", indexes = {
    @Index(name = "idx_version_name", columnList = "version_name"),
    @Index(name = "idx_version_platform", columnList = "platform_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Version extends BaseEntity {
    
    @Column(name = "version_name", nullable = false, length = 50)
    private String versionName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "platform_id", nullable = false, foreignKey = @ForeignKey(name = "fk_version_platform"))
    private Platform platform;
}
