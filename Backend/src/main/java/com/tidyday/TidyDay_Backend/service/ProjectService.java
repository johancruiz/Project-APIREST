package com.tidyday.TidyDay_Backend.service;

import com.tidyday.TidyDay_Backend.domain.Project;
import com.tidyday.TidyDay_Backend.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.tidyday.TidyDay_Backend.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ProjectService {
    @Autowired
    private final ProjectRepository projectRepository;

    public Page<Project> getAllProjects(int page, int size) {
        return projectRepository.findAll(PageRequest.of(page, size, Sort.by("title")));
    }

    public Project getProject(String id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project Not Found"));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        Project project = getProject(id);
        projectRepository.delete(project);
    }

    public String uploadPhoto(String id, MultipartFile file) {
        log.info("Saving picture for project ID: {}", id);
        Project project = getProject(id);
        String photoUrl = photoFunction.apply(id, file);
        project.setPhotoUrl(photoUrl);
        projectRepository.save(project);
        return photoUrl;
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename).filter(name -> name.contains("."))
            .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1)).orElse(".png");

    private final BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
        String filename = id + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/projects/image/" + filename).toUriString();
        } catch (Exception exception) {
            throw new RuntimeException("Unable to save image");
        }
    };
}
