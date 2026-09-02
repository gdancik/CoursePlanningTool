import {setupWorker} from "msw/browser"
import {http, HttpResponse} from "msw"
import {mockDb} from "./mockDatabase"
import { FormState } from "../../utils/PageRenderEngine/types";

const API_BASE = "https://gdancik.pythonanywhere.com/api";

export const handlers = [

    // GET ALL COURSES
    http.post(
        `${API_BASE}/getSheet/`,
        () => {
            return HttpResponse.json(
                mockDb.getAllCourses()
            );
        }
    ),

    // GET ONE COURSE
    http.post(
        `${API_BASE}/getCourse/`,
        async ({ request }) => {
            const body = await request.json() as {
                course_id: string;
            };

            const course =
                mockDb.getCourse(body.course_id);

            if (!course) {
                return HttpResponse.json(
                    {
                        error: "Course not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return HttpResponse.json(course);
        }
    ),

    // CREATE COURSE
    http.post(
        `${API_BASE}/createNewCourse/`,
        async ({ request }) => {
            const body = await request.json() as {
                dict_of_columns_and_vals: FormState;
            };

            const result = mockDb.createCourse(
                body.dict_of_columns_and_vals
            );

            return HttpResponse.json(result);
        }
    ),

    // UPDATE COURSE
    http.post(
        `${API_BASE}/updateValue/`,
        async ({ request }) => {
            const body = await request.json() as {
                course_id: string;
                dict_of_columns_and_vals:
                    Partial<FormState>;
            };

            const updated = mockDb.updateCourse(
                body.course_id,
                body.dict_of_columns_and_vals
            );

            if (!updated) {
                return HttpResponse.json(
                    {
                        error: "Course not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return new HttpResponse(null, {
                status: 200,
            });
        }
    ),

    // DELETE COURSE
    http.post(
        `${API_BASE}/deleteCourse/`,
        async ({ request }) => {
            const body = await request.json() as {
                course_id: string;
            };

            const deleted =
                mockDb.deleteCourse(body.course_id);

            if (!deleted) {
                return HttpResponse.json(
                    {
                        error: "Course not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return HttpResponse.json({
                course_id: body.course_id,
            });
        }
    ),

    // DUPLICATE COURSE
    http.post(
        `${API_BASE}/duplicateCourse/`,
        async ({ request }) => {
            const body = await request.json() as {
                course_id: string;
            };

            const result =
                mockDb.duplicateCourse(body.course_id);

            if (!result) {
                return HttpResponse.json(
                    {
                        error: "Course not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            return HttpResponse.json(result);
        }
    ),
    http.get(`${API_BASE}/test_login/`, ({ request }) => {

        const url = new URL(request.url);

        const user = url.searchParams.get("user"); 
           const password = url.searchParams.get("password");
           if (user === "annie" && password === "password") {
            return HttpResponse.json({
                 user: "annie",
                });
            }
            return HttpResponse.json(
                {},
                {
                status: 401,
            }
        );
    }),

    http.get(`${API_BASE}/test_data/`, () => {
    return HttpResponse.json({
        message: "Mock test data",
    });
}),
];
export const worker = setupWorker(...handlers);