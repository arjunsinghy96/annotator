import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Annotorious } from "@recogito/annotorious";

import "@recogito/annotorious/dist/annotorious.min.css";
import axios from "axios";

type Annotation = {
  tags: Array<string>;
  coords: string;
};

export const AnnotationPage = () => {
  const params = useParams();
  const imageId = params.imageId;
  const directoryId = params.directoryId;
  const imgRef = useRef(null);

  const [anno, setAnno] = useState<typeof Annotorious>();
  const [tool, setTool] = useState<string>("rect");

  const createAnnotationObject = (tags: Array<string>, coords: string): any => {
    return {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      type: "Annotation",
      body: tags.map((tag) => {
        return {
          type: "TextualBody",
          purpose: "tagging",
          value: "bus",
        };
      }),
      target: {
        selector: {
          type: "FragmentSelector",
          conformsTo: "http://www.w3.org/TR/media-frags/",
          value: `xywh=pixel:${coords}`,
        },
      },
    };
  };

  const addAnnotation = (
    annotorious: typeof Annotorious,
    tags: Array<string>,
    coords: string
  ) => {
    const annotationObject = createAnnotationObject(tags, coords);
    annotorious.addAnnotation(createAnnotationObject(tags, coords));
  };

  const getAndAddAnnotations = async (annotorious: typeof Annotorious) => {
    const resp = await axios.get(
      `http://localhost:8000/images/${imageId}/annotations`
    );
    if (resp.data.annotations && resp.data.annotations.length > 0) {
      resp.data.annotations.forEach((annotation: Annotation) => {
        addAnnotation(annotorious, annotation.tags, annotation.coords);
      });
    }
  };

  useEffect(() => {
    let annotorious: any = null;

    if (imgRef.current) {
      // Init
      annotorious = new Annotorious({
        image: imgRef.current,
        widgets: [
          { widget: "TAG", vocabulary: ["car", "bus", "autorickshaw", "bike"] },
        ],
      });
      setAnno(annotorious);
      console.log(anno);
      getAndAddAnnotations(annotorious);
    }

    // Cleanup: destroy current instance
    return () => annotorious.destroy();
  }, []);

  const submitAnnotations = async () => {
    let annotations = anno.getAnnotations();
    let annots: Annotation[] = [];
    annotations.forEach((an: any) => {
      let tags = an.body.map((t: Record<string, any>) => t.value);
      let coords = an.target.selector.value.split(":")[1];
      annots.push({
        tags,
        coords,
      });
    });

    if (annots.length > 0) {
      const resp = await axios.post(
        `http://localhost:8000/images/${imageId}/annotations`,
        annots
      );
      console.log(resp);
    }

    // console.log(annots);
  };

  return (
    <div className="min-h-screen max-h-screen w-screen flex flex-col">
      <div className="w-[80%] mx-auto h-16 px-5 flex justify-between">
        <Link className="my-auto" to={`/directory/${directoryId}`}>
          Back to Directory
        </Link>
        <button
          className="h-10 my-auto uppercase bg-blue-400 text-white font-bold text-center align-middle"
          onClick={() => submitAnnotations()}
        >
          save
        </button>
      </div>
      <div className="w-[80%] max-h-[50%] flex-1 flex justify-center mx-auto">
        <div className="mx-auto">
          <img
            ref={imgRef}
            src={`http://localhost:8000/images/${imageId}`}
          ></img>
        </div>
      </div>
    </div>
  );
};
