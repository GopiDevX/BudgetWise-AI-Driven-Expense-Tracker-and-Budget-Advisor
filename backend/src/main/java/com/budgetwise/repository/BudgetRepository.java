package com.budgetwise.repository;

import com.budgetwise.model.entity.Budget;
import com.budgetwise.model.entity.Category;
import com.budgetwise.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);

    List<Budget> findByUser(User user);

    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, Category category, Integer month, Integer year);

    Optional<Budget> findByUserAndCategoryIsNullAndMonthAndYear(User user, Integer month, Integer year);

    @Query("SELECT b FROM Budget b WHERE b.user = :user AND b.month = :month AND b.year = :year")
    List<Budget> findAllBudgetsForMonth(@Param("user") User user, @Param("month") Integer month,
            @Param("year") Integer year);

    void deleteByUserAndId(User user, Long id);
}
