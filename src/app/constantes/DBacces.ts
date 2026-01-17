export class DBacces {

    //credenciales de supabase

    static supabaseUrl = 'https://btffkxekeoepfgqwvvbw.supabase.co';
    static supabaseKey = 'sb_publishable_jvCai4RW65p36Gov_FxQ7w_VuzMDO6K';


    //bucket de imagenes pequeñas para las portadas de las revistas aprobadas, no para las de revision



    static suprabaseconteinerimg = "https://btffkxekeoepfgqwvvbw.supabase.co/storage/v1/object/public/base1/APROBADOS/"

    //bucket de archivos PDF de las revistas aprobadas, no para las de revision

    static suprabaseconteinerpdf = "https://btffkxekeoepfgqwvvbw.supabase.co/storage/v1/object/public/PDF/APROBADOS/"


    //bucket de imagenes pequeñas para las portadas de las revistas en revision estas URL se usan en el ADMINISTRACION PARA MOSTRAR LAS REVISTAS EN REVISION

    static suprabaseconteinerimgrev = "https://btffkxekeoepfgqwvvbw.supabase.co/storage/v1/object/public/base1/REVISION/"

    static suprabaseconteinerpdfrev = "https://btffkxekeoepfgqwvvbw.supabase.co/storage/v1/object/public/PDF/REVISION/"



    //bucket de imagenes pequeñas para las portadas y pdf de las revistas en revision estas URL se usan en el ENVIO DEL FORMULARIO

    static bucketNameImg = 'base1/REVISION';
    static bucketNamePdf = 'PDF/REVISION';

    //bucket de imagenes pequeñas para las portadas y pdf de las revistas aprobadas estas URL se usan en el ADMINISTRACION PARA MOVER DE REVISION A APROBADO

    static bucketNameImgAprobados = 'base1/APROBADOS';
    static bucketNamePdfAprobados = 'PDF/APROBADOS';


    static solonombrebucketimg = 'base1';
    static solonombrebucketpdf = 'PDF';

}
