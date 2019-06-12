const Query = {
  allUsers: (_, __, { db }) => {
    return db.query("SELECT * FROM users").spread(users => {
      return users;
    });
  },
  allRoles: (_, __, { db }) => {
    return db.query("SELECT * FROM roles").spread(roles => {
      return roles;
    });
  },
  allUsersRoles: (_, __, { db }) => {
    return db.query("SELECT * FROM users_roles").spread(roles => {
      return roles;
    });
  },

  eachUserRoles: async (_, { user_id }, { db }) => {
    return db
      .query(`SELECT * FROM users_roles WHERE user_id=?`, [user_id])
      .spread(roles => {
        return roles;
      });
  },
  allDistricts: (_, __, { db }) => {
    return db.query("SELECT * FROM districts").spread(district => {
      return district;
    });
  },
  allSchools: (_, __, { db }) => {
    return db
      .query(
        `SELECT s.id, (SELECT c.name FROM categories c WHERE c.id = s.category_id) as category_id, s.name, s.address, CASE WHEN s.mixed=0 THEN "Single Sex" ELSE "Mixed" END as mixed, 
        CASE WHEN s.boarding=0 THEN "Day School" ELSE "Boarding" END as boarding, (SELECT d.name FROM districts d WHERE d.id=s.district_id) as district FROM schools s`
      )
      .spread(schools => {
        return schools;
      });
  },
  secondarySchoolsPerDistrict: (_, { district_id }, { db }) => {
    return db
      .query(
        `SELECT s.id, s.name, (SELECT d.name FROM districts d 
        WHERE d.id=s.district_id) as district FROM schools s, 
        districts d WHERE d.id=s.district_id and d.id=? AND s.category_id=1`,
        [district_id]
      )
      .spread(schools => {
        return schools;
      });
  },
  primarySchoolsPerDistrict: (_, { district_id }, { db }) => {
    return db
      .query(
        `SELECT s.id, s.name, (SELECT d.name FROM districts d 
        WHERE d.id=s.district_id) as district FROM schools s, 
        districts d WHERE d.id=s.district_id and d.id=? AND s.category_id=2`,
        [district_id]
      )
      .spread(schools => {
        return schools;
      });
  },

  districtById: (_, { id }, { db }) => {
    return db
      .query("SELECT id, name, description FROM districts WHERE  id=?", [id])
      .spread(district => {
        return district;
      });
  },
  populationBySchoolIdAndYear: (_, { school_id, active_year }, { db }) => {
    return db
      .query(
        `SELECT s.class_id, (SELECT c.name FROM classes c 
            WHERE s.class_id=c.id) as class_name, count(*) as population 
            FROM students s WHERE s.school_id=? AND s.active_year=? GROUP BY s.class_id`,
        [school_id, active_year]
      )
      .spread(population => {
        return population;
      });
  },

  unebSummaryBySchoolIdAndGrade: (
    _,
    { school_id, grade, start_year, end_year },
    { db }
  ) => {
    return db
      .query(
        "SELECT id, number, exam_year FROM uneb_results_summary WHERE  school_id=? and grade=? AND exam_year BETWEEN ? AND ?",
        [school_id, grade, start_year, end_year]
      )
      .spread(result => {
        return result;
      });
  }
};

module.exports = Query;
