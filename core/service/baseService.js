export const DELETE_OPTION = {
  SOFT: "soft",
  HARD: "hard",
};

export default class BaseService {
  DAY_IN_MONTH = 26;
  repository;
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    return this.repository.create({ data });
  }

  async createMany(data) {
    return this.repository.create({ data, skipDuplicates: true });
  }

  async read(filter = {}, options = {}) {
    const { page = 1, limit = 20, sortBy, sortOrder = "asc" } = options;

    const skip = (page - 1) * parseInt(limit);
    const take = parseInt(limit);

    const queryOptions = {
      ...filter,
      skip,
      take,
    };

    if (sortBy) {
      queryOptions.orderBy = { [sortBy]: sortOrder };
    }

    const [data, total] = await Promise.all([
      this.repository.findMany(queryOptions),
      this.repository.count({ where: filter.where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async readOne(filter) {
    return this.repository.findFirst(filter);
  }

  async readById(id) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  async update(filter, data) {
    return this.repository.update({
      where: filter,
      data: this.removeUndefindedProps(data),
    });
  }

  async updateMany(filter) {
    return this.repository.update({
      where: filter,
      data: this.removeUndefindedProps(data),
    });
  }

  async delete(filter, option = DELETE_OPTION.HARD) {
    if (option === DELETE_OPTION.SOFT)
      return this.repository.update({
        where: filter,
        data: { isActive: false },
      });

    return this.repository.delete({ where: filter });
  }

  async deleteMany(filter, option = DELETE_OPTION.HARD) {
    if (option === DELETE_OPTION.SOFT)
      return this.repository.updateMany({
        where: filter,
        data: { isActive: false },
      });

    return this.repository.deleteMany({ where: filter });
  }

  removeUndefindedProps(data) {
    Object.keys(data).forEach(
      key => data[key] === undefined && delete data[key]
    );
    return data;
  }
}
