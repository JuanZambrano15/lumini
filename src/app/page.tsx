import Image from "next/image";
import Drop from "../components/DropdownMenu"
import Link from "next/link";
import logo from "../../public/logo.svg";
import arrow from "../../public/inicio/arrow_down.svg";
import login from "../../public/inicio/login.svg";
import facebook from "../../public/inicio/facebook.png"
import metodo from "../../public/inicio/metodo_lumini.svg"
import x from "../../public/inicio/x.png"
import youtube from "../../public/inicio/youtube.png"
import ig from "../../public/inicio/ig.png"
import colombia from "../../public/inicio/colombia.png"


export default function inicio(){
  return(
    <div>
      {/*NavBar*/}
      <div className="bg-[#9DFDE9] text-black text-2xl justify-around items-center flex fixed top-0 right-0 left-0">
        <Link href="/">
        <Image className="w-25 py-1 " alt="logo" src={logo}/>
        </Link>        
        <div className="flex items-center">
          <Drop/>      
        </div>
        <Link href="/">Planes</Link>
        <Link href="#metodo">¿Porqué elegirnos?</Link>
        <Link href="/login"><Image className="w-13" alt="login" src={login} /></Link>        
      </div>
      {/*Niña*/}
      <div className="bg-[url('../../public/inicio/niña.png')] bg-no-repeat h-screen text-white bg-cover mt-24">
        <div className="py-50 px-20 ">
          <h2 className=" text-6xl font-semibold">El metodo online de <br /> aprendizaje para niños <br /> de 4 a 14 años</h2>
          <p className="text-xl pt-6 pb-2">Garantice el exito academico de sus hijos</p>
          <Link href="/">
          
          <button className="relative p-[1px] bg-gradient-to-t from-black to-white rounded-3xl overflow-hidden group  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="block bg-[#FFE066] text-black py-3 px-25 rounded-3xl group-hover:bg-[#FFF080] group-hover:shadow-md transition-all duration-300">

            Prueba gratis 7 dias
            </span>
          </button>
          </Link>
        </div>
      </div>

      {/* separacion*/}
      <div className="bg-[#D5DEF7] h-25">
      </div>

      {/* metodo Lumini */}
      <section id="metodo">
        <Image alt="metodo" src={metodo} className="w-full"/>
      </section>

      {/*planes*/}
      <div>

      </div>

      {/*fotter */}
      <div className="bg-[#A767B4]">

        {/* informacion fotter*/}
        <div className="flex justify-around items-center py-3 border-[#B29DB8] border-b-3">
          <div>
            <p>Preguntas frecuentres <br />Aviso legal <br />Condiciones del servicio <br />Politica de privacidad y cookies</p>
          </div>
          <div>
            <p>+57 300 0000000 <br /> lumini@lumini.com</p>
          </div>
          <div className="flex flex-col items-center">
            <p>Siganos:</p>
            <div className=" flex gap-1">
              <Link href="https://es-la.facebook.com/"><Image alt="facebook" src={facebook} className="filter invert w-10"/></Link>
              <Link href="https://x.com/"><Image alt="x" src={x} className="filter invert w-10"/></Link>
              <Link href="https://www.youtube.com/"><Image alt="youtube" src={youtube} className=" w-10"/></Link>
              <Link href="https://www.instagram.com/"><Image alt="ig" src={ig} className="filter invert w-10"/></Link>

            </div>
          </div>
        </div>

        {/*derechos*/}
        <div className="flex justify-between py-3 px-40 items-center">
          <p> &copy; 2025 Lumini. Todos los derechos reservados</p>
          <div className="flex gap-4 items-center border-[#C9C6DB] border-2 p-1 rounded-4xl">
            <Image alt="colombia" src={colombia} className="w-10"/>
            <p>Colombia</p>
          </div>
        </div>
      </div>
    </div>
  );
}